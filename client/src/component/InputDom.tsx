import React from 'react'

function inputHeader(text : string)
{
    return <h2 className = "text-2xl mt-4">{text}</h2>;
}

function inputDescription(text : string)
{
    return <p  className = "text-gray-500 text-sm">{text}</p>;
}

function preInput(header : string, desc : string)
{
    return (
        <div>
            {inputHeader(header)}
            {inputDescription(desc)}
        </div>
    );
}

export 
{
    inputHeader
    , inputDescription
    , preInput
}
