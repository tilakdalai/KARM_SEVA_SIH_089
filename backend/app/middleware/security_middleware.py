from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
from app.config import settings


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    OWASP and Government Cyber Security compliant HTTP response headers middleware.
    Injects defensive headers to mitigate XSS, Clickjacking, MIME-sniffing, and data leakage.
    """

    async def dispatch(self, request: Request, call_next) -> Response:
        response: Response = await call_next(request)

        # 1. Prevent MIME-type sniffing
        response.headers["X-Content-Type-Options"] = "nosniff"

        # 2. Prevent UI Redressing / Clickjacking
        response.headers["X-Frame-Options"] = "DENY"

        # 3. Legacy XSS Filter protection
        response.headers["X-XSS-Protection"] = "1; mode=block"

        # 4. Referrer Policy: Send full URL only for same-origin, domain only for cross-origin
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"

        # 5. Restrict sensitive browser features (Permissions Policy)
        response.headers["Permissions-Policy"] = "geolocation=(self), camera=(), microphone=(), payment=(self)"

        # 6. HTTP Strict Transport Security (HSTS) in production or HTTPS mode
        if not settings.DEBUG or settings.APP_ENV == "production":
            response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains; preload"

        # 7. Content Security Policy (API responses)
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; "
            "img-src 'self' data: https: blob:; "
            "script-src 'self' 'unsafe-inline'; "
            "style-src 'self' 'unsafe-inline'; "
            "connect-src 'self' https:; "
            "frame-ancestors 'none';"
        )

        return response
