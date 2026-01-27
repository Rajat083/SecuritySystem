from pymongo.errors import OperationFailure


async def _create_index_safe(collection, keys, **kwargs):
    """Create index but ignore index-option conflicts if already exists."""
    try:
        return await collection.create_index(keys, **kwargs)
    except OperationFailure as exc:
        if exc.code == 85:  # IndexOptionsConflict
            # Index with same spec already exists under another name; ignore.
            return None
        raise


async def create_indexes(db):
    await _create_index_safe(
        db["campus_state"],
        [("user_type", 1), ("identifier", 1)],
        unique=True,
        name="uniq_user_type_identifier"
    )

    await _create_index_safe(
        db["campus_state"],
        [("user_type", 1), ("is_inside", 1)],
        name="idx_user_type_is_inside"
    )

    await _create_index_safe(
        db["access_logs"],
        [("identifier", 1), ("timestamp", -1)]
    )
    
    await _create_index_safe(
        db["student_logs"],
        [("identifier", 1), ("timestamp", -1)]
    )
    
    await _create_index_safe(
        db["visitor_logs"],
        [("identifier", 1), ("timestamp", -1)]
    )

    await _create_index_safe(
        db["exit_permissions"],
        [("student_roll", 1)]
    )
    
    await _create_index_safe(
        db["students"],
        [("roll_number", 1)],
        unique=True
    )
