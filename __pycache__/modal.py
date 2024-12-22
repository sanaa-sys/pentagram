from http.client import HTTPException
import sys
import os
from fastapi import Response, Request, Query
from datetime import datetime, timezone
import requests
import modal

def download_model():
    from diffusers import AutoPipelineForText2Image
    import torch
    AutoPipelineForText2Image.from_pretrained("stabilityai/sdxl-turbo", torch_dtype=torch.float16, variant="fp16")

    image = modal.Image.debian_slim().pip_install("fastapi(standard)","diffusers", "transformers", "accelerate","requests").run_function(download_model)
    app = modal.app("sd-demo", image = image, secrets=[modal.Secret.from_name("huggingface-secret")])
    @app.cls(image = image, gpu = "A100")
    class Model:
        @modal.build()
        @modal.enter()
        def load_weights(self):
              from diffusers import AutoPipelineForText2Image
              import torch
              self.pipe = AutoPipelineForText2Image.from_pretrained("stabilityai/sdxl-turbo", torch_dtype=torch.float16, variant="fp16")
              self.pipe.to("cuda")
              self.api_key = os.environ.get("huggingface-secret")

        @modal.web_endpoint()
        def generate(self, request: Request, prompt: str = Query(..., description = "The image description prompt")):
            api_key = request.headers.get("huggingface-secret")
            if api_key != self.api_key:
                raise HTTPException(status_code=401, detail="Unauthorized")
           
            image = self.pipe(prompt, num_inference_steps=1, guidance_scale=0.0).images[0]
            buffer = io.BytesIO()
            image.save(buffer, format="PNG")
            return Response(content=buffer.getvalue(), media_type="image/png")


    
         



