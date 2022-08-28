import { useState } from 'react';
import Select from 'react-select';
import './Questions.scss';

import { BsFillPatchPlusFill } from 'react-icons/bs'
import { BsPatchMinusFill } from 'react-icons/bs'
import { AiFillPlusSquare, AiOutlineMinusCircle } from 'react-icons/ai';
import { RiImageAddFill } from  'react-icons/ri' 
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';

const Questions = (props) => {
    const options = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' },
    ];
    const [selectedQuiz, setSelectedQuiz] = useState({});

    const [questions, setQuestions] = useState(
        [
            {
                id: uuidv4(),
                description: 'questions 1',
                imageFile: '',
                imageName: '',
                answers: [
                    {
                        id: uuidv4(), 
                        description: 'answer 1',
                        isCorrect: false,
                    }
                ]
            }
        ]
    );

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

    console.log('questions: ', questions);
    return (
        <div className="questions-container">
            <div className="title">
                Manage Questions
            </div>
            <hr />
            <div className="add-new question">
                <div className='col-6 form-group'>
                    <label className='mb-2'>Select Quiz: </label>
                    <Select
                        value={selectedQuiz}
                        onChange={setSelectedQuiz}
                        options={options}
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
                                        />
                                        <label>Question {index+1} 's description</label>
                                    </div>
                                    <div className='group-upload'>
                                        <label>
                                            <RiImageAddFill className='label-up' />
                                        </label>
                                        <input type={'file'} hidden />
                                        <span>0 file is uploaded</span>
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
                                            />
                                            <div className="form-floating answer-name">
                                                <input 
                                                    value={answer.description}
                                                    type="text" 
                                                    className="form-control" 
                                                    placeholder="name@example.com" 
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
                            </div>
                        )
                    })
                }              
            </div>
        </div>
    )
}

export default Questions;