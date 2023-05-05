
import { atom } from 'jotai';
import Cookies from 'js-cookie';

export function checkIsLoggedIn() {
    const token = Cookies.get('x-access-token');
    if (!token) return false;
    return true;
}
export const authorizationAtom = atom(checkIsLoggedIn());
export const idAtom = atom('');

