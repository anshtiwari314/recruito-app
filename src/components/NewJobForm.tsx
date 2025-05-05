import React from "react";

export default function NewJobForm{
    // const onBtnClick=()=>{
    //     const res=
    // }
    return 
    (
        <Card>
            <CardContent>
                <h2 className="text-xl font-semibold">Create New Job</h2>
                <Input  placeholder="Job ID"/>
                <Input placeholder="Job Title" />
                <Textarea placeholder="Job Description"/>
                <Textarea placeholder="key Criteria (Skills,experince,etc.)"/>
                <Button onClick={onBtnClick}>Create Job</Button>
            </CardContent>
        </Card>
    );
}