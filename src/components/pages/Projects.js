import { useLocation } from "react-router-dom"
import Message from "../layout/Message"
import Container from "../layout/Container"  
import Loading from "../layout/Loading"
import LinkButton from "../layout/LinkButton"
import ProjectCard from "../project/ProjectCard"
import styles from "./Projects.module.css"
import { useState, useEffect } from "react"
import API from '../../Api/api'


function Projects(){
    const [projects, setProjects] = useState([])
    const [removeLoading, setRemoveLoading] = useState(false)
    const [projectMessage, setProjectMessage] = useState('')
    
    const location = useLocation()
    let message = ''

    if(location.state){
        message = location.state.message
    }

    useEffect(()=>{
      fetch( `http://localhost:5000/projects`, {
        method: 'GET',
        headers:{
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.json())
      .then(data => {
        console.log(data + " data ")
        setProjects(data)
        setRemoveLoading(true)
      })
      .catch(err => {
        console.log(API)
        console.log(err)
      })
    },[])

    function removeProject(id){
       fetch(`http://localhost:5000/projects/${id}`,{
          method: 'DELETE',
          headers:{
            'Content-Type': 'application/json',
          }
        }
       )
       .then(resp => resp.json())
       .then(data => {
          setProjects(projects.filter(project => project.id !== id))
          setProjectMessage('Project has removed sucessfully!')
       })
       .catch(err => console.log(err))
    }

    return (
      <div className={styles.project_container}>
        <div className={styles.title_container}>
          <h1>Projects</h1>
          <LinkButton to="/newproject" text="Criar projeto"/>
        </div>
        {message && <Message type="sucess" message={message}/>}
        {projectMessage && <Message type="sucess" message={projectMessage}/>}
        <Container customClass="start">
          {projects.length > 0 &&
            projects.map(project => ( 
              <ProjectCard 
                id={project.id}
                name={project.name}
                budget={project.budget}
                category={project.category.name}
                key={project.id}
                handleRemove={removeProject}
              />
            ))}
            {!removeLoading && <Loading/>}
        </Container>
      </div>
    );
}

export default Projects;
