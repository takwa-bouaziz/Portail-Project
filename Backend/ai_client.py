import requests
from django.conf import settings


class HuggingFaceConfigError(Exception):
    pass


def _extract_router_message(result):
    choices = result.get("choices") or []
    if not choices:
        return ""

    message = choices[0].get("message") or {}
    content = message.get("content", "")

    if isinstance(content, str):
        return content

    if isinstance(content, list):
        text_parts = []
        for item in content:
            if isinstance(item, dict) and item.get("type") == "text":
                text_parts.append(item.get("text", ""))
        return "\n".join(part for part in text_parts if part)

    return str(content)


def call_hf_api(prompt, max_new_tokens=500):
    token = getattr(settings, "HF_API_TOKEN", "")
    url = getattr(settings, "HF_API_URL", "")
    model = getattr(settings, "HF_MODEL", "")

    if not token:
        raise HuggingFaceConfigError(
            "Hugging Face token is missing. Set HF_API_TOKEN in Backend/.env."
        )

    if not url:
        raise HuggingFaceConfigError(
            "Hugging Face model URL is missing. Set HF_API_URL in Backend/.env."
        )

    headers = {"Authorization": f"Bearer {token}"}

    if "router.huggingface.co" in url:
        if not model:
            raise HuggingFaceConfigError(
                "Hugging Face model is missing. Set HF_MODEL in Backend/.env."
            )

        headers["Content-Type"] = "application/json"
        payload = {
            "model": model,
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": max_new_tokens,
        }
    else:
        payload = {
            "inputs": prompt,
            "parameters": {"max_new_tokens": max_new_tokens},
        }

    timeout = int(getattr(settings, "HF_API_TIMEOUT", 120))
    response = requests.post(url, headers=headers, json=payload, timeout=timeout)
    response.raise_for_status()
    result = response.json()

    if isinstance(result, dict) and "choices" in result:
        extracted = _extract_router_message(result)
        if extracted:
            return extracted

    if isinstance(result, list) and result:
        return result[0].get("generated_text", "")

    if isinstance(result, dict):
        if "generated_text" in result:
            return result["generated_text"]
        if "error" in result:
            raise RuntimeError(result["error"])

    return str(result)
