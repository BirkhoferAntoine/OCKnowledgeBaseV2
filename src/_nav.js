export default {
    items: [
        {
            name: 'Dashboard',
            url: '/dashboard',
            icon: 'icon-home',
        },
        {
            title: true,
            name: 'Gestion de la base',
            wrapper: {            // optional wrapper object
                element: '',        // required valid HTML5 element tag
                attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
            },
            class: ''             // optional class names space delimited list for title item ex: "text-center"
        },
        {
            name: 'Edition',
            url: '/dashboard/editor',
            icon: 'icon-notebook',
            children: [
                {
                    name: 'Nouveau',
                    url: '/dashboard/editor/new',
                    icon: 'icon-doc',
                },
                {
                    name: 'Editer',
                    url: '/dashboard/editor/edit',
                    icon: 'icon-note',
                },
                {
                    name: 'Supprimer',
                    url: '/dashboard/editor/delete',
                    icon: 'icon-trash',
                },
            ],
        },
        {
            name: 'Organiser',
            url: '/dashboard/organize',
            icon: 'icon-grid',
            children: [
                {
                    name: 'Architecture',
                    url: '/dashboard/architect',
                    icon: 'icon-layers',
                },
            ]
        },
        {
            divider: true,
        },
        {
            title: true,
            name: 'Gestion du site',
            wrapper: {
                element: '',
                attributes: {},
            },
        },
        {
            name: 'Images',
            url: '/dashboard/images',
            icon: 'icon-picture',
            children: [
                {
                    name: 'Importer',
                    url: '/dashboard/images/upload',
                    icon: 'icon-link',
                },
                {
                    name: 'Gallerie',
                    url: '/dashboard/images/gallery',
                    icon: 'icon-film',
                }
            ]
        },
        {
            name: 'Apparence',
            url: '/dashboard/design',
            icon: 'icon-eye',
            children: [
                {
                    name: 'Thèmes',
                    url: '/dashboard/themes',
                    icon: 'icon-eyeglass',
                },
            ]
        },
        {
            divider: true,
        },
    ],
};
