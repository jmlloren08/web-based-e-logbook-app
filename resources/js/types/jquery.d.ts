import 'jquery';

declare global {
    interface Window {
        $: JQuery;
        jQuery: JQuery;
    }
} 