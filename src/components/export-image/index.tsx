import React, { useState, forwardRef, useImperativeHandle, useRef, useContext } from 'react';
import { Modal, Form, Input, Select, Button, notification } from 'antd';
import { FormInstance } from 'antd/es/form';
import { LoadingFullView } from '../loading';
import { ImageContext } from '../../context';
import './style.scss';

type ExportImageProps = {
    onSave: (fileName: string, extension: '.jpg' | '.png' | '.pdf') => Promise<void>
}

type FormSchema = {
    fileName: string
    extension: '.jpg' | '.png' | '.pdf'
}

export const ExportImageModal = forwardRef(({onSave}: ExportImageProps, ref) => {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const { currentImage, currentPage } = useContext(ImageContext);
    const formRef = useRef<FormInstance>(null);

    useImperativeHandle(ref, () => ({
        open: () => setVisible(true)
    }));

    const onExport = async (value: FormSchema) => {
        try {
            setLoading(true);
            await onSave(value.fileName, value.extension);
            onCloseModal();
        } catch (e) {
            notification.error({
                message: 'Save failed!'
            });
        } finally {
            setLoading(false);
        }
    };

    const onCloseModal = () => {
        setVisible(false);
    };


    const onExtensionChange = (value: '.jpg' | '.png' | '.pdf') => {
        formRef.current!.setFieldsValue({ extension: value });
    };

    return (
        <Modal title='Export Image' visible={visible}
            onCancel={onCloseModal}
            className='export-image-modal'
            footer={<div className='footer'>
                <Button shape='round' onClick={onCloseModal}>Cancel</Button>
                <Button type='primary' shape='round' onClick={() => formRef.current?.submit()}>Export</Button>
            </div>}
        >
            <Form className='export-form' ref={formRef} onFinish={onExport}>
                <Form.Item name='fileName' rules={[{ required: true }]} label='File name'
                    initialValue={
                        `${currentImage?.original_filename ?? ''}${currentImage?.type === 'application/pdf' ? `_page${currentPage}` : ''}`
                    }
                >
                    <Input placeholder='File name' />
                </Form.Item>
                <Form.Item name='extension' rules={[{ required: true }]} label='Extension' 
                    initialValue={currentImage?.type === 'application/pdf' ? '.pdf' : '.png'}>
                    <Select
                        placeholder="File Extension"
                        allowClear
                        onChange={onExtensionChange}
                    >
                        <Select.Option value=".png">.jpg</Select.Option>
                        <Select.Option value=".jpg">.png</Select.Option>
                        <Select.Option value=".pdf">.pdf</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
            {loading && <LoadingFullView />}
        </Modal>
    );
});