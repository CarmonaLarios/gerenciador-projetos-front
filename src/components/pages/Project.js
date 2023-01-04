import { parse, v4 as uuidv4 } from 'uuid';
import styles from './Project.module.css'
import { useParams } from 'react-router-dom'
import { useState, useEffect, React } from 'react';
import Loading  from '../layout/Loading';
import Container from '../layout/Container';
import ProjectForm from '../project/ProjectForm';
import Message from '../layout/Message';
import ServiceForm from '../../service/ServiceForm';
import ServiceCard from '../../service/ServiceCard';
const {REACT_APP_API_BASE_URL} = process.env

function Project() {

    const { id } = useParams()
    const [project, setProject] = useState([])
    const [services, setServices] = useState([])
    const [showProjectForm, setShowProjectForm] = useState(false)
    const [showServiceForm, setServiceForm] = useState(false)
    const [message, setMessage] = useState()
    const [type, setType] = useState()

    useEffect(() => {
        fetch(`${REACT_APP_API_BASE_URL}/projects/${id}`,{
            method:'GET',
            headers:{
                'Content-Type': 'application/json',
            }
        })
        .then((resp) => resp.json())
        .then((data) => {
            setProject(data)
            setServices(data.services)
        })
        .catch((err) => console.log(err))
    }, [id])

    const editPost = (project) => {
        if(project.budget < project.cost){
            setMessage('O orçamento não pode ser menor que o custo do projeto.')
            setType('error')
            return false;
        }

        fetch(`${REACT_APP_API_BASE_URL}/projects/${project.id}`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(project)
        })
        .then(resp => resp.json())
        .then(data => {
            setProject(data)
            setShowProjectForm(false)
            setMessage('Projeto atualizado')
            setType('sucess')
        })
        .catch(err => console.log(err))
    }

    const createService = (project) => {  
        const lastService = project.services[project.services.length - 1]
        lastService.id = uuidv4()

        const lastServiceCost = lastService.cost
        const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost)

        if(newCost > parseFloat(project.budget)){
            setMessage('Orçamento ultrapassado. Verifique o valor do serviço.')
            setType('error')
            project.services.pop()
            return false
        }

        project.cost = newCost

        fetch(`${REACT_APP_API_BASE_URL}/projects/${project.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(project)
        })
        .then(resp => resp.json())
        .then(data => {
            setMessage('Adicionado com sucesso!')
            setType('sucess')
            toggleServiceForm()
        })
        .catch(err => console.log(err))
    }

    const toggleProjectForm = () => {
        setShowProjectForm(!showProjectForm)
    }

    const toggleServiceForm = () => {
        setServiceForm(!showServiceForm)
    }

    const resetMessageState = () => {
        setMessage('')
        setType('')
    }

    const removeService = (id, cost) => {
        const serviceUpdate = project.services.filter(
            (service) => service.id !== id
        )

        const projectUpdated = project

        projectUpdated.services = serviceUpdate
        projectUpdated.cost = parseFloat(projectUpdated.cost) - parseFloat(cost)

        fetch(`${REACT_APP_API_BASE_URL}/projects/${projectUpdated.id}`,
            {method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projectUpdated)
        })
        .then(resp => resp.json())
        .then(data => {
            setProject(projectUpdated)
            setServices(projectUpdated.services)
            setMessage('Serviço removido com sucesso!')
            setType('sucess')
        })
        .catch(err => console.log(err))

    }

    return (
        <>{project.name ? (
            <div className={styles.project_details}>
                <Container customClass="column">
                    {message && <Message type={type} message={message} execAfterMessage={resetMessageState} />}
                    <div className={styles.details_container}> 
                        <h1>Projeto: {project.name}</h1>
                        <button className={styles.btn} onClick={toggleProjectForm}>{!showProjectForm ? 'Editar projeto' : 'Fechar'}</button>
                        {!showProjectForm ? (
                            <div className={styles.project_info}>
                                <p>
                                    <span>Categoria:</span> {project.category.name}
                                </p>
                                <p>
                                    <span>Total de Orçamento:</span> R${project.budget}
                                </p>
                                <p>
                                    <span>Total Utilizado:</span> R${project.cost}
                                </p>
                            </div>) : (
                            <div className={styles.project_info}>
                                <ProjectForm 
                                    handleSubmit={editPost} 
                                    btnText="Concluir edição"
                                    projectData={project}
                                />
                            </div>)}
                    </div>
                    <div className={styles.service_form_container}>
                        <h2>Adicione um serviço</h2>
                        <button className={styles.btn} onClick={toggleServiceForm}>
                            {!showServiceForm ? 'Adicionar serviço' : 'Fechar'}
                        </button>
                        <div className={styles.project_info}>
                            {showServiceForm && (<ServiceForm 
                                                    handleSubmit={createService}
                                                    btnText="Adicionar serviço"
                                                    projectData={project}
                                                />)}
                        </div>
                        <h2>Serviços</h2>
                        <Container customClass='start'>
                            {services.length > 0 && services.map((service) => 
                                <ServiceCard
                                    id={service.id}
                                    name={service.name}
                                    cost={service.cost}
                                    description={service.description}
                                    key={service.id}
                                    handleRemove={removeService} />    
                            )}
                            
                            {services.length > 0
                                ? <div></div>
                                : <p>Não há serviços cadastrados</p>
                            }
                        </Container>
                    </div>
                </Container>
            </div>): 
            (
                <Loading />
            )}</>
    )
}

export default Project

