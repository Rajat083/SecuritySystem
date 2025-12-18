async def create_indexes(db):
    await db["campus_state"].create_index(
        [("user_type", 1), ("is_inside", 1)]
    )

    await db["access_logs"].create_index(
        [("identifier", 1), ("timestamp", -1)]
    )
    
    await db["student_logs"].create_index(
        [("identifier", 1), ("timestamp", -1)]
    )
    
    await db["visitor_logs"].create_index(
        [("identifier", 1), ("timestamp", -1)]
    )

    await db["exit_permissions"].create_index(
        [("student_roll", 1)]
    )
    
    await db["students"].create_index(
        [("roll_number", 1)],
        unique=True
    )
