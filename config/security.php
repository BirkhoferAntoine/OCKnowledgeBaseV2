<?php

return [
    'session'       => [
        'authorization' => [
            'filter'        => FILTER_SANITIZE_SPECIAL_CHARS,
            'flags'         => FILTER_FLAG_STRIP_BACKTICK
        ],
    ],

    'server'        => [
        'ip'            => FILTER_VALIDATE_IP,
    ],

    'uri'           => [
        'filter'        => FILTER_SANITIZE_URL,
        'flags'         => FILTER_FLAG_STRIP_BACKTICK
    ],

    'get'           => [
        'category'                  =>      [
            'filter' => FILTER_SANITIZE_SPECIAL_CHARS,
            'flags'  => FILTER_FLAG_STRIP_BACKTICK
        ],
        'category_name'             =>      [
            'filter' => FILTER_SANITIZE_SPECIAL_CHARS,
            'flags'  => FILTER_FLAG_STRIP_BACKTICK
        ],
        'content'                   =>      [
            'filter' => FILTER_SANITIZE_SPECIAL_CHARS,
            'flags'  => FILTER_FLAG_STRIP_BACKTICK
        ],
        'categories'                =>      [
            'filter' => FILTER_SANITIZE_SPECIAL_CHARS,
            'flags'  => FILTER_FLAG_STRIP_BACKTICK
        ],
        'image'                     =>      [
            'filter' => FILTER_SANITIZE_SPECIAL_CHARS,
            'flags'  => FILTER_FLAG_STRIP_BACKTICK
        ],
        'title'                     =>      [
            'filter' => FILTER_SANITIZE_SPECIAL_CHARS,
            'flags'  => FILTER_FLAG_STRIP_BACKTICK
        ],
        'id'                        =>      [
            'filter' => FILTER_VALIDATE_INT,
            'flags'  => FILTER_FLAG_STRIP_BACKTICK
        ],
    ],

    'post'          => [
        'id'                        =>      [
            'filter' => FILTER_VALIDATE_INT,
            'flags'  => FILTER_FLAG_STRIP_BACKTICK
        ],
        'content'                   =>      [
            'filter' => FILTER_SANITIZE_SPECIAL_CHARS,
            'flags'  => FILTER_FLAG_STRIP_BACKTICK
        ],
        'title'                     =>      [
            'filter' => FILTER_SANITIZE_SPECIAL_CHARS,
            'flags'  => FILTER_FLAG_STRIP_BACKTICK
        ],
        'category'                  =>      [
            'filter' => FILTER_SANITIZE_SPECIAL_CHARS,
            'flags'  => FILTER_FLAG_STRIP_BACKTICK
        ],
        'sub_category'              =>      [
            'filter' => FILTER_SANITIZE_SPECIAL_CHARS,
            'flags'  => FILTER_FLAG_STRIP_BACKTICK
        ],
        'image'                     =>      [
            'filter' => FILTER_SANITIZE_SPECIAL_CHARS,
            'flags'  => FILTER_FLAG_STRIP_BACKTICK
        ],
        'user_name'                 =>      [
            'filter' => FILTER_SANITIZE_SPECIAL_CHARS,
            'flags'  => FILTER_FLAG_STRIP_BACKTICK
        ],
        'password'                 =>      [
            'filter' => FILTER_SANITIZE_SPECIAL_CHARS,
            'flags'  => FILTER_FLAG_STRIP_BACKTICK
        ],
    ]
];
