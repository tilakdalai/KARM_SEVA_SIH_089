from typing import Any, Optional
from fastapi.responses import JSONResponse


def success_response(
    data: Any = None,
    message: Optional[str] = None,
    status_code: int = 200
) -> dict:
    """Helper to return standard success dictionary matching APIResponse."""
    res = {
        "success": True,
        "data": data,
    }
    if message:
        res["message"] = message
    return res


def error_response(
    message: str,
    status_code: int = 400,
    errors: Any = None
) -> JSONResponse:
    """Helper to return JSONResponse for error cases."""
    return JSONResponse(
        status_code=status_code,
        content={
            "success": False,
            "message": message,
            "errors": errors,
        }
    )
