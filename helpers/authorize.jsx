
import { atom } from 'jotai';
import Cookies from 'js-cookie';

export function checkIsLoggedIn() {
    const token = Cookies.get('rememberMe');
    if (!token) return false;
    return true;
}
export const authorizationAtom = atom(checkIsLoggedIn());
export const idAtom = atom('');

