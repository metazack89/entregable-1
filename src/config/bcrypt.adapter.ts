import { genSaltSync, hashSync, compareSync } from 'bcryptjs';

export const encryptAdapter = {
    hash: (password: string) => {
        const salt = genSaltSync(12);
        return hashSync(password, salt);
    },

    compare: (unHushedPassword: string, hasshedPassword: string) => {
        return compareSync(unHushedPassword, hasshedPassword);
    },
};