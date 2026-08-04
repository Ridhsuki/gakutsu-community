<?php

return [

    /*
    |--------------------------------------------------------------------------
    | SEO Search Indexing Switch
    |--------------------------------------------------------------------------
    |
    | When set to true, search engine crawling and indexing is enabled.
    | When set to false, all public routes receive noindex directives,
    | robots.txt disallows crawling, and sitemap.xml returns a 404 response.
    |
    */

    'indexing_enabled' => (bool) env('SEO_INDEXING_ENABLED', false),

];
