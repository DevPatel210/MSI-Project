export class CustomValidator{
    static passwordValidator(password:any): any {
    if (password.pristine) {
        return null;
    }
    const PASSWORD_REGEX = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])/;
    password.markAsTouched();
    if (PASSWORD_REGEX.test(password.value)) {
        return null;
    }
    return {
        invalidPassword: true
    };
    }
}