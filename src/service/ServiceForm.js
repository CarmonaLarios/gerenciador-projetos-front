import styles from '../components/project/ProjectForm.module.css'
import Input from '../components/form/Input';
import SubmitButton from '../components/form/SubmitButton';
import { useState } from 'react';

function ServiceForm({ handleSubmit, btnText, projectData }) {

    const [service, setService] = useState({})

    const Submit = (e) => {
        e.preventDefault()
        projectData.services.push(service)
        handleSubmit(projectData)
    }

    const handleChange = (e) => {
        setService({...service, [e.target.name]: e.target.value})
    }

    return (  
        <form onSubmit={Submit} className={styles.form}>
            <Input
                type="text" 
                text="Nome do serviço"
                name="name"
                placeHolder="Insira o nome do serviço"
                handleOnChange={handleChange}
            />
            <Input
                type="number" 
                text="Custo serviço"
                name="cost"
                placeHolder="Insira o valor total"
                handleOnChange={handleChange}
            />
            <Input
                type="text" 
                text="Descrição do serviço"
                name="description"
                placeHolder="Descreva o serviço serviço"
                handleOnChange={handleChange}
            />
            <SubmitButton text={btnText}/>
        </form>
    );
}

export default ServiceForm;
