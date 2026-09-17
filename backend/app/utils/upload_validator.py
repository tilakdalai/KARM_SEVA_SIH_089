import os
import re
import uuid
from typing import List, Optional, Tuple

ALLOWED_DOC_MIME_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
]

ALLOWED_DOC_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".pdf"]
MAX_DOCUMENT_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB
MAX_PROFILE_PHOTO_SIZE_BYTES = 2 * 1024 * 1024  # 2 MB


def sanitize_filename(original_filename: str, prefix: str = "shram") -> str:
    """
    Generates a cryptographically random, collision-free, path-traversal-proof filename.
    Strips directory traversal sequences (e.g. ../, ..\\, null bytes) and retains safe extension.
    """
    if not original_filename:
        return f"{prefix}_{uuid.uuid4().hex[:12]}.bin"

    # Extract base name and lowercased extension
    base = os.path.basename(original_filename)
    # Remove all non-alphanumeric except dots and dashes
    clean_base = re.sub(r"[^a-zA-Z0-9._-]", "", base)
    _, ext = os.path.splitext(clean_base)
    ext = ext.lower()

    if ext not in ALLOWED_DOC_EXTENSIONS:
        ext = ".bin"

    safe_name = f"{prefix}_{uuid.uuid4().hex[:16]}{ext}"
    return safe_name


def validate_upload_metadata(
    filename: str,
    content_type: str,
    size_bytes: int,
    max_size_bytes: int = MAX_DOCUMENT_SIZE_BYTES,
    allowed_mimes: Optional[List[str]] = None,
) -> Tuple[bool, Optional[str]]:
    """
    Validates upload metadata against strict MIME types, file extensions, and size limits.
    """
    allowed_mimes = allowed_mimes or ALLOWED_DOC_MIME_TYPES

    # 1. Check content type
    if content_type.lower() not in allowed_mimes:
        return (
            False,
            f"Invalid file type '{content_type}'. Allowed formats: JPEG, PNG, WebP, PDF.",
        )

    # 2. Check extension
    _, ext = os.path.splitext(filename or "")
    if ext.lower() not in ALLOWED_DOC_EXTENSIONS:
        return (
            False,
            f"Invalid file extension '{ext}'. Allowed extensions: {', '.join(ALLOWED_DOC_EXTENSIONS)}",
        )

    # 3. Check payload size
    if size_bytes > max_size_bytes:
        max_mb = max_size_bytes / (1024 * 1024)
        return (
            False,
            f"File size ({size_bytes / (1024 * 1024):.2f} MB) exceeds maximum allowed limit of {max_mb:.1f} MB.",
        )

    return True, None
