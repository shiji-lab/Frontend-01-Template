var component = 
create(
    Parent, 
    {
        id: "a",
        className: "b"
    }, 
    create(
        Child, 
        {
            id: "c1"
        }
    ), 
    create(
        Child, 
        {
            id: "c2"
        }, 
        create(
            Child, 
            null
        )
    ), 
    create(
        Child, 
        {
            id: "c3"
        }
    )
);