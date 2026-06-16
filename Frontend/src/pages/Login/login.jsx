import style from "./login.module.css"
import imagemCasamento from "../../assets/imagemCasamento.png"
import logoCasamento from "../../assets/logoCasamento.png"
import { Button, Form, InputGroup, Stack } from 'react-bootstrap'
import InputGroupText from "react-bootstrap/esm/InputGroupText"

import { MdAttachEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { useEffect, useState } from "react"
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify"
import Api from "../../service/api"
import { useNavigate } from "react-router"


const Login = () => {
    const [mostrarSenha, setMostrarSenha] = useState(false)
    const [formData, setFormData] = useState({
        email: '', senha: ''
    })

    const handleChange = (e) => {
        const {name, value} = e.target 

        if(!name) console.log('Sem nome no input')

        setFormData((prev) => ({...prev, [name]: value}))
    }
    const navigate = useNavigate()
    const handleSubmit = async(e) => {
        try{

            e.preventDefault();
            
            const res = await Api.post('/usuario/login', formData)

            if(res.status === 200){
                toast.success('Usuário logado com sucesso')
                localStorage.clear();
                localStorage.setItem('token', res.data.token)
                navigate('/')
            }
            
        }catch(err){
            const erros = err.response.data?.erros 

            if(erros){
                Object.values(erros).forEach((msg) => {
                    toast.error(msg)
                })
            }else{
                toast.error(err.response.data?.mensagem)
            }
        }

    }

    useEffect(() => {
        if(localStorage.getItem('token')){
            navigate('/')
        }
    }, [])

    return (
        <div className={style.divLogin}>
            <div className={style.divFoto}>
                <img src={imagemCasamento} className={style.imagem}  alt="Imagem casamento"/>
            </div>

            <div className={style.divForm}>
                <img src={logoCasamento} className={style.logo} alt="Logo casamento" />
                <h1>Senac Wedding</h1>
                <h5>Seu portal de casamentos</h5>
                <hr className="w-75" />

                <Form onSubmit={handleSubmit} className="w-75">
                    <Stack gap={4}>

                    <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <InputGroup>
                            <InputGroupText><MdAttachEmail />
                            </InputGroupText>

                            <Form.Control 
                            type="email"
                            value={formData.email}
                            placeholder="Seu melhor email"
                            name="email"
                            required
                            onChange={handleChange}
                            />
                        </InputGroup>
                    </Form.Group>
                     <Form.Group>
                        <Form.Label>Senha</Form.Label>
                        <InputGroup>
                            <InputGroupText><RiLockPasswordFill />

                            </InputGroupText>

                            <Form.Control
                            type={mostrarSenha ? 'text' : 'password'}
                            value={formData.senha}
                            placeholder="Sua senha mais segura"
                            name="senha"
                            required
                            onChange={handleChange}
                            />
                            <Button className="bg-transparent border" onClick={() => setMostrarSenha(!mostrarSenha)}>{mostrarSenha ? <FaEye color="black"/> : <FaEyeSlash color="black"/>}</Button>
                        </InputGroup>
                    </Form.Group>
                    <Button type="submit" className={style.btnLogin}>Login</Button>
                    </Stack>
                </Form>
            </div>
        </div>
    )
}

export default Login;