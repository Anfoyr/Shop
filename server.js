import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const app = express();
const port = 3000;
const uri = 'mongodb://localhost:27017/users';

mongoose.connect(uri)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
    lastname: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

const User = mongoose.model('User', userSchema);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.post('/authorization', async (req, res) => {

    const { lastname, name, email, password } = req.body;
    try {
        
        const user = await User.findOne({ email });
        
        if (user) {
            // Если email найден, возвращаем сообщение
            return res.status(400).json({ message: 'Данная почта уже зарегистрирована' });
        }

       
        const newUser = new User({
            lastname,
            name,
            email,
            password
        });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully', email: email }); // Возвращаем данные
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).json({ message: 'Could not create user', error: error.message });
    }
});

app.get('/authorization', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'P_Authorization.html'));
});


app.post('/entrance', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Ищем пользователя по email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        // Сравниваем пароль в открытом виде
        if (password !== user.password) {
            return res.status(401).json({ message: 'Неверный пароль' });
        }

        // Если всё верно, возвращаем успешный ответ
        res.status(200).json({ 
            message: 'Вход выполнен успешно', 
            user: { 
                name: user.name, 
                lastname: user.lastname, 
                email: user.email 
            } 
        });
    } catch (error) {
        console.error('Ошибка при входе:', error);
        res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
});



app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Пользователь с таким email не найден' });
        }

        // Генерируем токен
        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 час
        await user.save();

        // Отправляем email
        const mailOptions = {
            from: 'a@mail.ru',
            to: email,
            subject: 'Сброс пароля',
            html: `
                <p>Вы запросили сброс пароля для аккаунта ${email}</p>
                <p>Пожалуйста, перейдите по следующей ссылке, чтобы сбросить пароль:</p>
                <a href="http://localhost:3000/reset-password/${token}">
                    Сбросить пароль
                </a>
                <p>Ссылка действительна в течение 1 часа.</p>
            `
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Письмо с инструкциями отправлено на ваш email' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

app.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Неверный или просроченный токен' });
        }

        // Обновляем пароль
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Пароль успешно изменен' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465,
    secure: true,
    auth: {
        user: 'a@mail.ru',
        pass: '2000'
    }
});



app.get('/entrance', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Entrance.html'));
});
app.get('/user/space', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Space.html'));
});
app.get('/user/code.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'code.js'));
});
app.get('/user/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'style.css'));
});
app.get('/reset-password/:token', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'EntranceNew.html'));
});
app.get('/forgot-password', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'EntranceNew0.html'));
});


app.get('/user/Nut_m12.jpg', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Nut_m12.jpg'));
});
app.get('/user/Washer_11371-78.jpg', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Washer_11371-78.jpg'));
});
app.get('/user/Breadboard_MB-102.jpg', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Breadboard_MB-102.jpg'));
});
app.get('/user/Screv_Tech-Krep.jpg', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Screv_Tech-Krep.jpg'));
});
app.get('/user/Breadboard_GSMIN_PCB1.jpg', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Breadboard_GSMIN_PCB1.jpg'));
});
app.get('/user/Breadboard_ProsKit_BX-4123.jpg', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Breadboard_ProsKit_BX-4123.jpg'));
});
app.get('/user/Breadboard_ProsKit_BX-4135.jpg', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Breadboard_ProsKit_BX-4135.jpg'));
});
app.get('/user/Nut_m6_din_934.jpg', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Nut_m6_din_934.jpg'));
});
app.get('/user/Nut_m12_din_934.jpg', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Nut_m12_din_934.jpg'));
});
app.get('/user/Screv_Din_7985.jpg', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Screv_Din_7985.jpg'));
});
app.get('/user/Spring_Stamo_Din-2098.jpg', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Spring_Stamo_Din-2098.jpg'));
});
app.get('/user/Washer_Dinfix_A2.jpg', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Washer_Dinfix_A2.jpg'));
});
 

app.get('/user/:email', async (req, res) => {
    const userEmail = req.params.email;

    try {
        const user = await User.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).send('Пользователь не найден');
        }

        // Встраиваем данные пользователя в HTML
        const userHTML = `
            <!DOCTYPE html>
            <html lang="ru">
            <head>
                <link href=style.css type=text/css rel="stylesheet" 
                <meta charset="UTF-8">
                <title>Страница пользователя</title>
            </head>
            <body>
                <h1 style="text-align: center; color: rgb(214, 149, 27)">Добро пожаловать, ${user.name}!</h1>
                <div id="user-data">
                    <p><strong>Фамилия:</strong> ${user.lastname}</p>
                    <p><strong>Имя:</strong> ${user.name}</p>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <a href="http://localhost:3000/user/space"><h3 title="Хорошего дня!" style="color: green;">Приступить к работе!</h3></a>
                    <button src=https://www.kznamya.ru/news title
                    <button id="news">Наши новости</button>
                </div>          
                <script>
                    document.getElementById('news').addEventListener('click', function(){
                        window.location.href = 'https://www.kznamya.ru/news'
                    })  
                </script>    
            </body>
            </html>
        `;       
        res.send(userHTML); // Отправляем готовую HTML-страницу
    } catch (error) {
        console.error('Ошибка при поиске пользователя:', error);
        res.status(500).send('Ошибка сервера');
    }
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}/entrance`);
});