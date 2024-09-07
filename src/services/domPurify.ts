import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';

const domClean = (data: string) => {
    const window = new JSDOM('').window;
    const purify = DOMPurify(window);
    const clean = purify.sanitize(data);
    return clean;
};

export default domClean;
