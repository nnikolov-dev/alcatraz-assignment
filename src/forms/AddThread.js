import React from 'react'
import {useFormik} from 'formik'
import {object, string} from 'yup';
import RTEditor from '../components/RTEditor'
import {EditorState, convertToRaw} from 'draft-js';
import {StatusCodes} from 'http-status-codes';
import {toast} from 'react-toastify';

const AddThread = ({cb}) => {

    const _onSubmit = async ({title, username, editorState}) => {
        const rawDraftContentState = JSON.stringify(convertToRaw(editorState.getCurrentContent()))
        const response = await fetch('/thread', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({title, username, editorState: rawDraftContentState})
        })
        const {status} = response
        if (status === StatusCodes.OK) {
            toast.success('Thread Added');
            const data = await response.json()
            cb(data)
            resetForm()
        } else {
            toast.error('Error');
        }
    }

    const {
        handleSubmit,
        handleChange,
        errors,
        values,
        setFieldValue,
        resetForm
    } = useFormik({
        initialValues: {
            username: '',
            title: '',
            editorState: EditorState.createEmpty(),
        },
        validationSchema: object().shape({
            title: string()
                .required('Required!'),
            username: string()
                .required('Required!'),
            editorState: object()
                .test('has-content', 'Required!', 
                    (value) => {
                        return value.getCurrentContent().hasText()
                    })
        }),
        onSubmit: (threadData) => {
        _onSubmit(threadData);
        },
    });

    return (
        <form onSubmit={handleSubmit}>
            <input
                className="appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                id="username"
                name="username"
                value={values.username}
                onChange={handleChange}
                type="text"
                placeholder="Username"
            />
            {errors.username && (
                <div className="my-2 p-2 bg-red-100">{errors.username}</div>
            )}
            <input
                className="appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                id="title"
                name="title"
                value={values.title}
                onChange={handleChange}
                type="text"
                placeholder="Title"
            />
            {errors.title && (
                <div className="my-2 p-2 bg-red-100">{errors.title}</div>
            )}
            <RTEditor
                editorState={values.editorState}
                onChange={setFieldValue}
            />
            {errors.editorState && (
                <div className="my-2 p-2 bg-red-100">{errors.editorState}</div>
            )}
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline mt-2"
                type="submit"
            >
                Submit
            </button>
        </form>
    )
}

export default AddThread;