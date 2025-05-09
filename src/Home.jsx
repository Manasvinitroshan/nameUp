import React, { useState } from 'react';
import './global.css';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const Home = () => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState([]); // Array to hold all responses
  console.log('Responses:', responses);
  const handleClick = async () => {
    if (inputText.trim() === '') return;
    setLoading(true);
  
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY || process.env.REACT_APP_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'Based on the startup idea the user gives, give a list of 7 startup names and that is it. No extra text.',
            },
            {
              role: 'user',
              content: inputText,
            },
          ],
          temperature: 1,
          max_tokens: 200,
        }),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        console.error('OpenAI Error:', errorData);
        setResponses(prev => [...prev, {
          query: inputText,
          result: `Error: ${errorData.error?.message || 'Unknown error from OpenAI'}`,
          timestamp: new Date().toLocaleTimeString(),
          isError: true
        }]);
        return;
      }
  
      const data = await res.json();
      const message = data.choices[0].message.content;
      const names = message.split('\n').map(name => name.replace(/^\d+[\).]\s*/, '').trim()).filter(n => n);
  
      // ✅ Check domains for ALL names
      const domainResults = await Promise.all(
        names.map(async (name) => {
          try {
            const domainRes = await fetch(`http://localhost:5001/check-domain?name=${name}`);
            const domainData = await domainRes.json();
            return { name, available: domainData.available };
          } catch (err) {
            console.error(`Domain check error for ${name}:`, err);
            return { name, available: 'Error checking domain' };
          }
        })
      );
  
      // ✅ Add to responses
      setResponses(prev => [...prev, {
        query: inputText,
        result: `${message}\n\n` +
                domainResults.map(d =>
                  `${d.name} is ${d.available === true ? 'available ✅' : d.available === false ? 'unavailable ❌' : d.available}`
                ).join('\n'),
        timestamp: new Date().toLocaleTimeString(),
        isError: false
      }]);
  
      setInputText('');
    } catch (error) {
      console.error('Error generating names:', error);
      setResponses(prev => [...prev, {
        query: inputText,
        result: `Error: ${error.message || 'Something went wrong!'}`,
        timestamp: new Date().toLocaleTimeString(),
        isError: true
      }]);
    } finally {
      setLoading(false);
    }
  };
  
  
  
  return (
    <div className='container news-cycle-regular'>
      <div className='container2'>
      <h1 className='container2'>NameUP</h1>
        {/* Stacked Responses */}
        {responses.length > 0 && (
          <div style={{ width: '65vw', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
            
            {responses.map((response, index) => (
              <Box
                key={index}
                sx={{
                  p: 2,
                  border: '1px solid #ccc',
                  borderRadius: '12px',
                  backgroundColor: response.isError ? '#fff0f0' : '#f5f5f5',
                  color: '#000',
                  fontSize: '1rem'
                }}
                className='news-cycle-regular'
              >
                <div style={{ marginBottom: '8px', fontSize: '0.8rem', color: '#666' }} className='news-cycle-bold'>
                  <strong>Idea:</strong> {response.query} <span style={{ float: 'right' }}>{response.timestamp}</span>
                </div>
                <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: 0 }} className='news-cycle-regular'>
                  {response.result}
                </pre>
              </Box>
            ))}
          </div>
        )}

        {/* Loading Bar */}
        {loading && (
          <Box sx={{ width: '65vw', mb: 2, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress sx={{ color: "white" }} />
          </Box>
        )}

        

        {/* Input & Button */}
        <Box
          component="section"
          className='myBox news-cycle-regular'
          sx={{
            p: 2,
            border: 1,
            borderColor:'white',
            borderRadius: '16px',
            width: '65vw',
            height: '8vh',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}
        >
          <input
            name="myInput"
            className="myInput news-cycle-regular"
            placeholder="Enter your startup idea..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleClick()}
            style={{ flexGrow: 1, border: 'none', outline: 'none', fontSize: '1rem' }}
          />
          

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: "30px",
              minWidth: "48px",
              height: "48px",
              padding: 0,
              '&:hover': {
                backgroundColor: "#f0f0f0",
              },
            }}
            onClick={handleClick}
            disabled={loading}
          >
            <KeyboardArrowUpIcon sx={{ color: "#b8ad9e" }} />
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default Home;