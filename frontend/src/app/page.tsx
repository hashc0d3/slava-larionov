'use client';

import { useEffect, useState } from 'react';

export default function Home() {
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        fetch('/api/greeting')
            .then(res => res.json())
            .then(data => setGreeting(data.message));
    }, []);

    return (
        <div>
            {greeting ? greeting : 'Загрузка...'}
        </div>
    );
}