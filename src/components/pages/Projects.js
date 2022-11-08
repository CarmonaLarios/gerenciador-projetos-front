import { useLocation } from "react-router-dom"
import Message from "../layout/Message"
import Container from "../layout/Container"  
import Loading from "../layout/Loading"
import LinkButton from "../layout/LinkButton"
import ProjectCard from "../project/ProjectCard"
import styles from "./Projects.module.css"
import { useState, useEffect } from "react"

function Projects(){
    const [projects, setProjects] = useState([])
    const [removeLoading, setRemoveLoading] = useState(false)
    
    const location = useLocation()
    let message = ''

    if(location.state){
        message = location.state.message
    }

    useEffect(()=>{
      fetch('http://localhost:5000/projects', {
        method: 'GET',
        headers:{
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.json())
      .then(data => {
        setProjects(data)
        setRemoveLoading(true)
      })
      .catch(err =>console.log(err))
    },[])

    return (
      <div className={styles.project_container}>
        <div className={styles.title_container}>
          <h1>Projects</h1>
          <LinkButton to="/newproject" text="Criar projeto"/>
        </div>
        {message && <Message type="sucess" message={message}/>}
        <Container customClass="start">
          {projects.length > 0 &&
            projects.map(project => ( 
              <ProjectCard 
                id={project.id}
                name={project.name}
                budget={project.budget}
                category={project.category.name}
                key={project.id}
              />
            ))}
            {!removeLoading && <Loading/>}
        </Container>
      </div>
    );
}

export default Projects;
