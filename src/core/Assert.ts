namespace core {
    
    export function Assert(expr: boolean, msg?: string): void
    {
        if (!expr)
            throw new Error("Assertion failed. " + (msg || ""));
    }
    
}