import time
import logging
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

logger = logging.getLogger("karmseva.access")
logging.basicConfig(level=logging.INFO)


class LoggingMiddleware(BaseHTTPMiddleware):
    """
    Middleware for structured request logging and response time profiling.
    """
    async def dispatch(self, request: Request, call_next) -> Response:
        start_time = time.time()
        client_host = request.client.host if request.client else "unknown"

        response = await call_next(request)

        process_time = (time.time() - start_time) * 1000
        formatted_process_time = f"{process_time:.2f}ms"
        response.headers["X-Process-Time"] = formatted_process_time

        logger.info(
            f"{request.method} {request.url.path} "
            f"status={response.status_code} client={client_host} duration={formatted_process_time}"
        )
        return response
