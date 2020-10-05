const nestedStringTest = /^('|")(.+)\1$/;

export function unquoteString(stringToUnquote: string) {
    return nestedStringTest.test(stringToUnquote) ? JSON.parse(stringToUnquote.replace(nestedStringTest, `"$2"`)) : stringToUnquote;
}
