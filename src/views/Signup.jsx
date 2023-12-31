const { VITE_APP_HOST } = import.meta.env;
import { useState } from "react";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const Signup = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        nickname: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }
    const navigate = useNavigate();

    const submitSignup = async (e) => {
        e.preventDefault();
        // 密碼確認
        if (formData.pwd !== formData.password) {
            MySwal.fire({
                title: '兩次密碼輸入不相符',
                icon: 'error',
                toast: true
            })
            return
        }
        try {
            const res = await axios.post(`${VITE_APP_HOST}/users/sign_up`, formData);
            // 當註冊成功轉址到登入頁
            navigate('/');
            MySwal.fire({
                title: '註冊成功',
                icon: 'success',
                toast: true,
                showConfirmButton: false,
                timer: 2000
            })
        } catch (error) {
            MySwal.fire({
                title: `${error.response.data.message}`,
                icon: 'error',
                toast: true
            })
        }
    }
    return (<>
        <form className="formControls" onSubmit={submitSignup}>
            <h2 className="formControls_txt">註冊帳號</h2>
            <label className="formControls_label" htmlFor="email">Email</label>
            <input className="formControls_input" type="text" id="email" name="email" placeholder="請輸入 email" required onChange={handleChange} />
            <label className="formControls_label" htmlFor="nickname">您的暱稱</label>
            <input className="formControls_input" type="text" name="nickname" id="nickname" placeholder="請輸入您的暱稱" onChange={handleChange} />
            <label className="formControls_label" htmlFor="pwd">密碼</label>
            <input className="formControls_input" type="password" name="password" id="pwd" placeholder="請輸入密碼" autoComplete="true" required onChange={handleChange} />
            <label className="formControls_label" htmlFor="pwdcheck">再次輸入密碼</label>
            <input className="formControls_input" type="password" name="pwd" id="pwdcheck" placeholder="請再次輸入密碼" autoComplete="true" required onChange={handleChange} />
            <button className="formControls_btnSubmit" type="submit">註冊帳號</button>
            <NavLink className="formControls_btnLink" to="/">登入</NavLink>
        </form>
    </>)
}

export default Signup