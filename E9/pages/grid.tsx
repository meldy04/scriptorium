import React from 'react';

const GridPage = () => {

    const cards = [
        { id: 1, imageSrc: '../London_Skyline_(125508655).jpeg', title: 'Card Title 1', description: 'Description for card 1.' },
        { id: 2, imageSrc: '../London_Skyline_(125508655).jpeg', title: 'Card Title 2', description: 'Description for card 2.' },
        { id: 3, imageSrc: '../London_Skyline_(125508655).jpeg', title: 'Card Title 3', description: 'Description for card 3.' },
        { id: 4, imageSrc: '../London_Skyline_(125508655).jpeg', title: 'Card Title 4', description: 'Description for card 4.' },
        { id: 5, imageSrc: '../London_Skyline_(125508655).jpeg', title: 'Card Title 5', description: 'Description for card 5.' },
        { id: 6, imageSrc: '../London_Skyline_(125508655).jpeg', title: 'Card Title 6', description: 'Description for card 6.' },
        { id: 7, imageSrc: '../London_Skyline_(125508655).jpeg', title: 'Card Title 7', description: 'Description for card 7.' },
        { id: 8, imageSrc: '../London_Skyline_(125508655).jpeg', title: 'Card Title 8', description: 'Description for card 8.' },
    ];

    return (
        <div id="grid" className="container mx-auto p-4 bg-red-500">
            {/* Grid container */}
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card) => (
                    <div
                        key={card.id}
                        className="card bg-white border-2 border-gray-200 rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow duration-200"
                    >
                        <img
                            src={card.imageSrc}
                            alt={card.title}
                            className="card-image w-full h-48 object-cover rounded-md mb-4"
                        />
                        <h2 className="card-title text-xl font-semibold mb-2">{card.title}</h2>
                        <p className="card-description text-gray-600">{card.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GridPage;
