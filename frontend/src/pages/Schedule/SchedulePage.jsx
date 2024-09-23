import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from "../../utils/axiosInstance";
import { UserContext } from "../../providers/UserProvider";
import FeedbackContainer from "../Playground/FeedbackContainer";

const SchedulePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dayContent, setDayContent] = useState('');
  const [dayTitle, setDayTitle] = useState('');
  const [schedule, setSchedule] = useState([]);
  const [topicModalOpen, setTopicModalOpen] = useState(false);
  const [newTopic, setNewTopic] = useState('');
  const [newTopics, setNewTopics] = useState([]);

  const { user, isUserLoading } = useContext(UserContext);
  let headerText = 'Your learning schedule';
  //localStorage.setItem('HeaderSchedule','Here is your learning schedule for Java, Springboot, Software Engineering. The schedule should cover fundamental concepts, practical applications, and best practices. Focus on a structured approach that gradually builds skills.')
  headerText = localStorage.getItem('HeaderSchedule')

  useEffect(() => {
    // Load schedule data from localStorage on page load
    const storedSchedule = localStorage.getItem('schedule');
    console.log(storedSchedule)
    if (storedSchedule) {
      try {

        function convertKeysToUnquoted(jsonString) {
            // Parse the JSON string into a JavaScript object
            let parsedData;
            try {
                parsedData = JSON.parse(jsonString);
            } catch (error) {
                console.error('Error parsing JSON:', error);
                return null;
            }
        
            // Convert the object keys (not needed here as all keys are already unquoted in JavaScript)
            // But for demonstration, if you need to transform deeply nested objects or arrays:
            function deepTransformKeys(obj) {
                if (Array.isArray(obj)) {
                    return obj.map(item => deepTransformKeys(item));
                } else if (typeof obj === 'object' && obj !== null) {
                    return Object.keys(obj).reduce((acc, key) => {
                        acc[key] = deepTransformKeys(obj[key]);
                        return acc;
                    }, {});
                }
                return obj;
            }
        
            // Transform the parsed data
            const transformedData = deepTransformKeys(parsedData);
        
            return transformedData;
        }
        
        const parsedSchedule = convertKeysToUnquoted(JSON.parse(storedSchedule));
        console.log(parsedSchedule)
        //console.log(parsedSchedule["schedule"])
        if (parsedSchedule && Array.isArray(parsedSchedule.schedule)) {
          setSchedule(parsedSchedule.schedule);
        } else {
          console.error('Invalid schedule format:', parsedSchedule);
        }
      } catch (error) {
        console.error('Error parsing schedule data:', error);
      }
    }
  }, []);
  useEffect(() => {
    // This will run when `schedule` changes
    console.log(schedule);
  }, [schedule]);

  // Handle opening the day modal and fetching content for the day
  const openModal = (day) => {
    setSelectedDay(day);
    setIsModalOpen(true);
    fetchDayContent(day);
  };

  const fetchDayContent = async (day) => {
    setIsLoading(true);
    // Simulate an API call with a delay
    setTimeout(() => {
      const foundDay = schedule.find((d) => d.day === day);
      if (foundDay) {
        setDayContent(foundDay.content);
        setDayTitle(foundDay.title);
      } else {
        setDayTitle('No title here')
        setDayContent('No content for this day.');
      }
      setIsLoading(false);
    }, 1000);
  };
  

  // Handle submitting the new schedule with user-input topics
  const handleUpdateSchedule = () => {
    if (!user) {
      alert('Please login to update the schedule');
      return;
    }
    let prompt = 'Generate a 30-day learning schedule for '
    // Construct the prompt using the user-added topics
    let upperText = 'Here is your learning schedule for '
    prompt += newTopics.join(', ');

    upperText += newTopics.join(', ');
    upperText += '. The schedule should cover fundamental concepts, practical applications, and best practices. Focus on a structured approach that gradually builds skills.'
    localStorage.setItem('HeaderSchedule',upperText) 

    prompt += '. Each day should have a clear title and detailed content. Give the response just like as a json body ,dont add something else like ```json```. Structure is only {schedule:[{day:1,title:,content:},{}]}. The schedule should cover fundamental concepts, practical applications, and best practices. Focus on a structured approach that gradually builds skills.'

    // Simulate an API call
    axiosInstance.post('/prompt', { prompt: prompt, geminiKey: import.meta.env.VITE_GEMINI_API_KEY })
      .then((response) => {
        const updatedSchedule = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        setSchedule(updatedSchedule);
        console.log(updatedSchedule)
        // Save to localStorage
        localStorage.setItem('schedule', JSON.stringify(updatedSchedule));
        setTopicModalOpen(false);
      })
      .catch((error) => {
        console.error('Error updating schedule:', error);
      });
  };

  // Handle adding a new topic
  const handleAddTopic = () => {
    if (newTopic && !newTopics.includes(newTopic)) {
      setNewTopics([...newTopics, newTopic]);
      setNewTopic('');
    }
  };

  return (
    <div className="min-h-screen bg-black p-4">
      {isUserLoading ? (
        <div>Loading...</div>
      ) : !user ? (
        <div>Please login to see your schedule</div>
      ) : (
        <>
          <h2 className="text-3xl font-bold text-center mb-8">Personalized Learning Schedule</h2>
          <h2 className="text-xl font-bold text-center mb-8">{headerText}</h2>

          {/* Calendar Grid */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-4 border border-white p-4">
        {Array.from({ length: 30 }, (_, i) => (
            <div
            key={i + 1}
            className="border border-gray-400 p-4 text-center cursor-pointer hover:bg-gray-200 hover:text-black"
            onClick={() => openModal(i + 1)}
            >
            Day {i + 1}
            </div>
        ))}
        </div>

        {/* Modal for day content */}
        {isModalOpen && (
        <div className="fixed inset-0 z-10 flex items-center justify-center w-full h-screen bg-black bg-opacity-30">
            <div className="relative bg-gray-700 rounded-lg  mx-auto p-6">
            <div className="flex items-center justify-between p-4 border-b rounded-t">
                <h3 className="text-lg font-semibold">{dayTitle}</h3>
                <button
                type="button"
                className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
                onClick={() => setIsModalOpen(false)}
                >
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1l6 6m0 0l6 6m-6-6l6-6m-6 6L1 7" />
                </svg>
                </button>
            </div>
            <div className="p-4">
                {isLoading ? <div>Loading...</div> : <FeedbackContainer text={dayContent}/>}
            </div>
            <button
                className="mt-4 bg-purple-500 text-white px-4 py-2 rounded"
                onClick={() => setIsModalOpen(false)}
            >
                Complete
            </button>
            </div>
        </div>
        )}


          {/* Button to open topic modal */}
          <div className="mt-8 text-center">
            
            <button data-modal-target="default-modal" data-modal-toggle="default-modal" onClick={() => setTopicModalOpen(true)} className="bg-green-500 text-white px-4 py-2 rounded" type="button">
                Update to New Schedule
            </button>
          </div>



          <div id="default-modal" tabIndex="-1" aria-hidden="true" class='' className={`${topicModalOpen ? '' : 'hidden'} overflow-y-auto fixed inset-0 z-50 flex items-center justify-center w-full h-screen`}>
                <div className="relative p-4 w-full max-w-2xl max-h-full">
                    {/* Modal content */}
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    {/* Modal header */}
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Add Topics for Schedule
                        </h3>
                        <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => setTopicModalOpen(false)}>
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                        <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    {/* Modal body */}
                    <div className="p-4 md:p-5 space-y-4">
                        <input
                        type="text"
                        value={newTopic}
                        onChange={(e) => setNewTopic(e.target.value)}
                        className="border p-2 w-full mb-4"
                        placeholder="Enter topic"
                        />
                        <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={handleAddTopic}
                        >
                        Add Topic
                        </button>
                        <div className="mt-4">
                        {newTopics.length > 0 && (
                            <ul className="list-disc pl-5">
                            {newTopics.map((topic, index) => (
                                <li key={index}>{topic}</li>
                            ))}
                            </ul>
                        )}
                        </div>
                    </div>
                    {/* Modal footer */}
                    <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                        <button
                        onClick={handleUpdateSchedule}
                        className="text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        >
                        Save and Update Schedule
                        </button>
                    </div>
                    </div>
                </div>
                </div>

        </>
      )}
    </div>
  );
};

export default SchedulePage;
