import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils'
import Cookies from 'js-cookie';

export function checkIsLoggedIn() {
    const token = Cookies.get('token');
    const rememberMe = Cookies.get('rememberMe');
    if (rememberMe) return true;
    if (!token) return false;
    return true;
}
export const authorizationAtom = atom(checkIsLoggedIn());
export const idAtom = atomWithStorage('');

