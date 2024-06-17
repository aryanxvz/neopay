
"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Select } from "../../../packages/ui/src/Select";
import { useState } from "react";
import { TextInput } from "../../../packages/ui/src/TextInput";
import React from "react";

const SUPPORTED_BANKS = [{
    name: "HDFC Bank",
    redirectUrl: "https://netbanking.hdfcbank.com"
}, {
    name: "Axis Bank",
    redirectUrl: "https://www.axisbank.com/"
}];

export const AddMoney = () => {
    const [redirectUrl, setRedirectUrl] = useState(SUPPORTED_BANKS[0]?.redirectUrl);

    return <Card title="Add Money">
    <div className="w-full py-2">

        <div className="py-2">
            <TextInput label={"Amount"} placeholder={"Amount"} onChange={() => {
            }} />
        </div>
        <div className="py-2 pl-1 text-left">
            Bank
        </div>
        
        <Select onSelect={(value) => {
            setRedirectUrl(SUPPORTED_BANKS.find(x => x.name === value)?.redirectUrl || "")
        }} options={SUPPORTED_BANKS.map(x => ({
            key: x.name,
            value: x.name
        }))} />

        <div className="flex justify-center pt-6">
            <Button onClick={() => {
                window.location.href = redirectUrl || "";
            }}>
            Add Money
            </Button>
        </div>
    </div>
</Card>
}