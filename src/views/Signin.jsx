const { VITE_APP_HOST } = import.meta.env;
import { useState } from "react";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const Signin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const submitSignin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await axios.post(`${VITE_APP_HOST}/users/sign_in`, formData);
            const { token, nickname } = res.data;
            document.cookie = `token=${token}; path=/;`
            localStorage.setItem('nickname', nickname);
            navigate('/todo');
            MySwal.fire({
                title: '登入成功',
                icon: 'success',
                toast: true,
                showConfirmButton: false,
                timer: 2000
            })
        } catch (error) {
            let text = [];
            error.response.data.message.forEach((item) => {
                text.push(item)
            })
            MySwal.fire({
                title: `${text}`,
                icon: 'error',
                toast: true
            })
        }
        setIsLoading(false);
    }
    return (<>
        <form className="formControls" onSubmit={submitSignin}>
            <h2 className="formControls_txt">最實用的線上代辦事項服務</h2>
            <label className="formControls_label" htmlFor="email">Email</label>
            <input className="formControls_input" type="text" id="email" name="email" placeholder="請輸入 email" required onChange={handleChange} />
            {/* <span>此欄位不可留空</span> */}
            <label className="formControls_label" htmlFor="pwd">密碼</label>
            <input className="formControls_input" type="password" name="password" id="pwd" placeholder="請輸入密碼" autoComplete="true" required onChange={handleChange} />
            <button className="formControls_btnSubmit" type="submit" disabled={isLoading}>登入</button>
            <NavLink className="formControls_btnLink" to="/sign_up">註冊帳號</NavLink>
        </form>
    </>)
}

export default Signin