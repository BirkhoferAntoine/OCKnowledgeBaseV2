import React from "react";
import {
    Button,
    Form,
    FormGroup,
    FormFeedback,
    Input,
    Label
} from 'reactstrap';
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import useEditorForm from "./useEditorForm";

const EditorForm = (props) => {

    const required = [
        'title',
        'content',
        'category',
        'sub_category'
    ]

    const {
        handleChange,
        handleCKEditor,
        handleSubmit,
        values, errors } = useEditorForm(props.submit, required, props.page);

    return (
        <Form onSubmit={handleSubmit} noValidate>
            <FormGroup className={"d-flex flex-column justify-content-evenly"}>

                <Label className={'my-2'} htmlFor="postTitle">Titre</Label>
                <Input type="text" className={`${errors.title && 'form-control is-invalid'}`}
                       id="postTitle" name="title" placeholder="Titre"
                       value={values.title} onChange={handleChange}/>
                {
                    errors.title &&
                    <FormFeedback className="invalid-feedback">
                        {errors.title}
                    </FormFeedback>
                }

                <Label className={'my-2'} htmlFor="postCategory">Catégorie</Label>
                <Input type="select" className={`${errors.category && 'form-control is-invalid'}`}
                       id="postCategory" name="category" placeholder="Catégorie"
                       value={values.category} onChange={handleChange} >
                    <option>Catégorie</option>
                    <option value={'News'}>News</option>
                    <option value={'HTML'}>HTML</option>
                    <option value={'CSS'}>CSS</option>
                    <option value={'JavaScript'}>JavaScript</option>
                    <option value={'PHP'}>PHP</option>
                </Input>
                {
                    errors.category &&
                    <FormFeedback className="invalid-feedback">
                        {errors.category}
                    </FormFeedback>
                }

                <Label className={'my-2'} htmlFor="postSubCategory">Sous-catégorie</Label>
                <Input type="text" className={`${errors.sub_category && 'form-control is-invalid'}`}
                       id="postSubCategory" name="sub_category" placeholder="Sous-catégorie"
                       value={values.sub_category} onChange={handleChange} />
                {
                    errors.sub_category &&
                    <FormFeedback className="invalid-feedback">
                        {errors.sub_category}
                    </FormFeedback>
                }

                <Label className={'my-2'} htmlFor="postContent">CKEditor</Label>
                <CKEditor className={`${errors.content && 'form-control is-invalid'}`}
                          id="postContent" name="content"
                          editor={ClassicEditor}
                          data={values.content}
                          onChange={(event, editor) => {
                              handleCKEditor(editor.getData());
                          }}
                />
                {
                    errors.content &&
                    <FormFeedback className="invalid-feedback">
                        {errors.content}
                    </FormFeedback>
                }

                <Label className={'my-2'} htmlFor="postImage">Image</Label>
                <Input type="text" className={`${errors.image && 'form-control is-invalid'}`}
                       id="postImage" name="image" placeholder="Image"
                       value={values.image} onChange={handleChange} />
                {errors.image &&
                <FormFeedback className="invalid-feedback">
                    {errors.image}
                </FormFeedback>}

                <div className="form-actions d-flex justify-content-center m-2">
                    <Button type="submit" color="primary">Soumettre</Button>
                </div>
            </FormGroup>
        </Form>
    )
}

export default EditorForm;