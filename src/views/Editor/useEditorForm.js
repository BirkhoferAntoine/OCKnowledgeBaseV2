import { useState } from 'react';

const useEditorForm = (callback, required, page = null) => {

    const formValues = page ? {
            id:             page.id,
            title:          page.title,
            category:       page.category,
            sub_category:   page.sub_category,
            content:        page.content,
            image:          page.image,
        }
                            : {
            title:          '',
            category:       '',
            sub_category:   '',
            content:        '',
            image:          '',
        };

    const [values, setValues] = useState(formValues);

    const [errors, setErrors] = useState({});

    const handleChange = event => {
        const {name, value} = event.target;

        setValues({
            ...values,
            [name]: value
        });
    }

    const handleCKEditor = (data) => {
        const name = 'content';

        setValues({
            ...values,
            [name]: data
        })
    }

    const handleSubmit = event => {
        event.preventDefault();
        const isInvalid = validateForm();
        return isInvalid ? setErrors(isInvalid) : callback(values);
    }

    const validateForm = () => {
        let errors = {};

        required.forEach((key) => {
            if (!values[key]) {
                errors[key] = 'Veuillez compléter ce champ pour soumettre'
            }
        })

        //Vérifie si des erreurs existent et exécute le callback
        if (Object.keys(errors).length === 0) {
            return false;
        }
        return errors;
    }

    return {
        handleChange,
        handleCKEditor,
        handleSubmit,
        values,
        errors
    };
};
export default useEditorForm;