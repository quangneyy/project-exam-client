import { useState } from 'react';
import Select from 'react-select';
import './QuizQA.scss';
import { BsFillPatchPlusFill } from 'react-icons/bs'
import { BsPatchMinusFill } from 'react-icons/bs'
import { AiFillPlusSquare, AiOutlineMinusCircle } from 'react-icons/ai';
import { RiImageAddFill } from  'react-icons/ri' 
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import Lightbox from "react-awesome-lightbox";
import { useEffect } from 'react';
import { getQuizWithQA, getAllQuizForAdmin, postCreateNewQuestionForQuiz, postCreateNewAnswerForQuestion } from '../../../../services/apiService';
import { toast } from 'react-toastify';

const QuizQA = (props) => {
    const initQuestions = [
        {
            id: uuidv4(),
            description: '',
            imageFile: '',
            imageName: '',
            answers: [
                {
                    id: uuidv4(), 
                    description: '',
                    isCorrect: false,
                }
            ]
        }
    ];

    const [questions, setQuestions] = useState(initQuestions);

    const [isPreviewImage, setIsPreviewImage] = useState(false);
    const [dataImagePreview, setDataImagePreview] = useState({
        title: '',
        url: '',
    })

    const [listQuiz, setListQuiz] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState({});

    useEffect(() => {
        fetchQuiz();
    }, [])

    useEffect(() => {
        if(selectedQuiz && selectedQuiz.value) {
            fetchQuizWithQA();
        }
    }, [selectedQuiz])

    //return a promise that resolves with a File instance
    function urltoFile(url, filename, mimeType){
        return (fetch(url)
            .then(function(res){return res.arrayBuffer();})
            .then(function(buf){return new File([buf], filename,{type:mimeType});})
        );
    }
    
    const fetchQuizWithQA = async () => {
        let rs =  await getQuizWithQA(selectedQuiz.value);
        if (rs && rs.EC === 0) {
            // convert base64 to File object
            let newQA = [];
            for(let i = 0; i < rs.DT.qa.length; i++) {
                let q = rs.DT.qa[i];
                if (q.imageFile) {
                    q.imageName = `Question-${q.id}.png`;
                    q.imageFile =
                    await urltoFile(`data:image/png;base64,${q.imageFile}=`, `Question-${q.id}.png`,'image/png')
                }
                newQA.push(q);
            } 
            setQuestions(newQA);
        }
    }
    const fetchQuiz = async () => {
        let res = await getAllQuizForAdmin();
        if (res && res.EC === 0) {
            let newQuiz = res.DT.map(item => {
                return { 
                    value: item.id,
                    label: `${item.id} - ${item.description}`
                }
            })
            setListQuiz(newQuiz);
        }
    }

    const handleAddRemoveQuestion = (type, id) => {
        if(type==='ADD') {
            const newQuestion = {
                id: uuidv4(),
                description: '',
                imageFile: '',
                imageName: '',
                answers: [
                    {
                        id: uuidv4(), 
                        description: '',
                        isCorrect: false,
                    }
                ]
            };
            setQuestions([...questions, newQuestion]);
        }

        if(type === 'REMOVE') {
            let questionsClone = _.cloneDeep(questions);
            questionsClone = questionsClone.filter(item => item.id !== id);
            setQuestions(questionsClone);
        }
    }

    const handleAddRemoveAnswer = (type, questionId, answerId) => {
        let questionsClone = _.cloneDeep(questions);
        if(type==='ADD') {
            const newAnswer = 
            {
                id: uuidv4(), 
                description: '',
                isCorrect: false,
            };

            let index = questionsClone.findIndex(item => item.id === questionId); 
            questionsClone[index].answers.push(newAnswer);
            setQuestions(questionsClone);
        }
        if (type === 'REMOVE') {
            let index = questionsClone.findIndex(item => item.id === questionId);
            questionsClone[index].answers = 
                questionsClone[index].answers.filter(item => item.id !== answerId); 
            setQuestions(questionsClone);
        }
    }

    const handleOnChange = (type, questionId, value) => {   
        if (type === 'QUESTION') {
            let questionsClone = _.cloneDeep(questions);

            let index = questionsClone.findIndex(item => item.id === questionId);
            if (index > -1) {
                questionsClone[index].description = value;
                setQuestions(questionsClone);
            }
        }
    }

    const handleOnChangeFileQuestion = (questionId, event) => {
        let questionsClone = _.cloneDeep(questions);

            let index = questionsClone.findIndex(item => item.id === questionId);
            if (index > -1 && event.target && event.target.files && event.target.files[0]) {
                questionsClone[index].imageFile = event.target.files[0];
                questionsClone[index].imageName = event.target.files[0].name;
                setQuestions(questionsClone);
            }
    }

    const handleAnswerQuestion = (type, answerId, questionId, value) => {
        let questionsClone = _.cloneDeep(questions);
        let index = questionsClone.findIndex(item => item.id === questionId);
        if (index > -1) {
            questionsClone[index].answers = 
                questionsClone[index].answers.map(answer => {
                    if (answer.id === answerId) {
                        if(type === 'CHECKBOX') {
                            answer.isCorrect = value;
                        }
                        if(type === 'INPUT') {
                            answer.description = value;
                        }
                    }
                    return answer;
                })

            setQuestions(questionsClone);
        }
    }

    const handleSubmitQuestionForQuiz = async () => {
        // todo
        if(_.isEmpty(selectedQuiz)) {
            toast.error("Please choose a Quiz!");
            return;
        }

        // validate answer
        let isValidAnswer = true;
        let indexQ = 0, indexA = 0;
        for(let i = 0; i < questions.length; i++) {
            for (let j = 0; j < questions[i].answers.length; j++) {
                if (!questions[i].answers[j].description) {
                    isValidAnswer = false;
                    indexA = j;
                    break;
                }
            }
            indexQ = i;
            if(isValidAnswer === false) break;
        }

        if (isValidAnswer === false) {
            toast.error(`Not empty Answer ${indexA + 1} at Question ${indexQ + 1}`);
            return;
        }

        // validate question
        let isValidQ = true;
        let indexQ1 = 0;
        for(let i = 0; i < questions.length; i++) {
            if (!questions[i].description) {
                isValidQ = false;
                indexQ1 = i; 
                break;
            }
        }

        if(isValidQ === false) {
            toast.error(`Not empty description for Question ${indexQ1 + 1}`);
            return;
        }

        if (isValidAnswer === false) {
            toast.error(`Not empty Answer ${indexA + 1} at Question ${indexQ + 1}`);
            return;
        }

        for (const question of questions) {
            const q = await postCreateNewQuestionForQuiz(
                +selectedQuiz.value, 
                question.description, 
                question.imageFile
            );
            for (const answer of question.answer) {
                await postCreateNewAnswerForQuestion(
                    answer.description, answer.isCorrect, q.DT.id 
                )
            }
        }

        toast.success('Create questions and answer succced');
        setQuestions(initQuestions);
    }

    const handlePreviewImage = (questionId) => {
        let questionsClone = _.cloneDeep(questions);
        let index = questionsClone.findIndex(item => item.id === questionId);
        if (index > -1) {
            setDataImagePreview({
                url: URL.createObjectURL(questionsClone[index].imageFile),
                title: questionsClone[index].imageName,
            })
            setIsPreviewImage(true);
        }
    }
    return (
        <div className="questions-container">
            <div className="add-new question">
                <div className='col-6 form-group'>
                    <label className='mb-2'>Select Quiz: </label>
                    <Select
                        value={selectedQuiz}
                        onChange={setSelectedQuiz}
                        options={listQuiz}
                    />
                </div>
                <div className="mt-3 mb-2">
                    Add questions:
                </div>   
                {
                    questions && questions.length > 0 
                    && questions.map((question, index) => {
                        return (
                            <div key={question.id} className='q-main mb-4'>
                                <div className='questions-content'>
                                    <div className="form-floating description">
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            placeholder="name@example.com"
                                            value={question.description} 
                                            onChange={(event) => handleOnChange('QUESTION', question.id, event.target.value)}
                                        />
                                        <label>Question {index+1} 's description</label>
                                    </div>
                                    <div className='group-upload'>
                                        <label htmlFor={`${question.id}`}>
                                            <RiImageAddFill className='label-up' />
                                        </label>
                                        <input 
                                            id={`${question.id}`}
                                            onChange={(event) => handleOnChangeFileQuestion(question.id, event)}
                                            type={'file'} 
                                            hidden 
                                        />
                                        <span>{question.imageName ? 
                                            <span
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => handlePreviewImage(question.id)}>
                                                {question.imageName}</span> 
                                                : 
                                                '0 file is uploaded'
                                            }</span>
                                    </div>
                                    <div className='btn-add'>
                                        <span onClick={() => handleAddRemoveQuestion('ADD', '')}>
                                            <BsFillPatchPlusFill className='icon-add' />
                                        </span>
                                        {questions.length > 1 && 
                                            <span onClick={() => handleAddRemoveQuestion('REMOVE', question.id)}>
                                                <BsPatchMinusFill className='icon-remove' />
                                            </span>
                                        }
                                    </div>
                                </div>

                                {question.answers && question.answers.length > 0 
                                && question.answers.map((answer, index) => {
                                    return (
                                        <div key={answer.id} className='answers-content'>
                                            <input 
                                                className="form-check-input iscorrect" 
                                                type="checkbox" 
                                                checked={answer.isCorrect}
                                                onChange={(event) => 
                                                    handleAnswerQuestion('CHECKBOX', answer.id, question.id, event.target.checked)}
                                            />
                                            <div className="form-floating answer-name">
                                                <input 
                                                    value={answer.description}
                                                    type="text" 
                                                    className="form-control" 
                                                    placeholder="name@example.com" 
                                                    onChange={(event) => 
                                                    handleAnswerQuestion('INPUT', answer.id, question.id, event.target.value)}
                                                />
                                                <label>Answers {index + 1}</label>
                                            </div>
                                            <div className='btn-group'>
                                                <span onClick={() => handleAddRemoveAnswer('ADD', question.id)}>
                                                    <AiFillPlusSquare className='icon-add' />
                                                </span>
                                                { question.answers.length > 1 &&
                                                    <span onClick={() => handleAddRemoveAnswer('REMOVE', question.id, answer.id)}>
                                                        <AiOutlineMinusCircle className='icon-remove' />
                                                    </span>
                                                }
                                            </div>
                                        </div>
                                    )
                                })
                                }

                                {isPreviewImage === true &&
                                    <Lightbox 
                                        image={URL.createObjectURL(question.imageFile)}
                                        title={question.imageName}
                                        onClose={() => setIsPreviewImage(false)}
                                    ></Lightbox>   
                                } 
                            </div>
                        )
                    })
                }   
                {
                    questions && questions.length > 0 && 
                    <div>
                        <button 
                            onClick={() => handleSubmitQuestionForQuiz()}
                            className='btn btn-warning'
                        >Save Questions</button>
                    </div>
                }

                {isPreviewImage === true &&
                    <Lightbox 
                        image={dataImagePreview.url}
                        title={dataImagePreview.title}
                        onClose={() => setIsPreviewImage(false)}
                    >
                    </Lightbox>   
                }              
            </div>     
        </div>
    )
}

export default QuizQA;