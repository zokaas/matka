// Function to create a typed environment that accepts a generic parser.
export function makeTypedEnvironment<T>(schema: (v: unknown) => T) {
    //console.log(schema);
    // Spread the arguments to clone them, avoiding mutations to the original object.
    return (args: Record<string, unknown>): T => schema({ ...args });
}
