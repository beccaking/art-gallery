import React, { useState, useEffect, useRef } from 'react';

const Modal = ({ showModal, setShowModal, isModalLoading, departmentName, departmentDetails }) => {
    const leftArrow = React.useRef(null)
    const rightArrow = React.useRef(null)

    useEffect(() => {
        if(!departmentDetails) {
            return
        }

        leftArrow.current.addEventListener('click', function(){
            let index = document.querySelector('.artwork-gallery .active').getAttribute('id')
            index = Number(index.replace('artwork-', ''))
            let lastIndex = document.querySelector('.artwork-gallery').childElementCount - 1
            document.querySelector('.artwork-gallery .active').classList.remove('active')

            if(index === 0) {
                document.querySelector('.artwork-gallery #artwork-' + lastIndex.toString()).classList.add('active')
            } else {
                document.querySelector('.artwork-gallery #artwork-' + (index - 1)).classList.add('active')
            }
        })

        rightArrow.current.addEventListener('click', function(){
            let index = document.querySelector('.artwork-gallery .active').getAttribute('id')
            index = Number(index.replace('artwork-', ''))
            let lastIndex = document.querySelector('.artwork-gallery').childElementCount - 1
            document.querySelector('.artwork-gallery .active').classList.remove('active')

            if(index === lastIndex) {
                document.querySelector('.artwork-gallery #artwork-0').classList.add('active')
            } else {
                document.querySelector('.artwork-gallery #artwork-' + (index + 1)).classList.add('active')
            }
        })

        return () => {
            leftArrow.current.removeEventListener('click', () => {})
            rightArrow.current.removeEventListener('click', () => {})
        }
    }, [departmentDetails])

    return (
        <div className="modal" style={{display: showModal === true ? "block" : "none"}}>
            <div className="modal-content">
                <div className="modal-header">
                <h3>Inside the Collection: {departmentName}</h3>
                    <span className="close" onClick={() => setShowModal(false)}>
                        &times;
                    </span>
                </div>
                {isModalLoading ? ( // Check if loading state is true
                    <div className="loading-screen">
                        <div className="loading-wheel"></div>
                    </div>
                    ) : (
                        <div className="modal-body">
                            <div className="left-arrow" key="left-arrow" ref={leftArrow}>
                                <img width="25" height="25" src="https://img.icons8.com/external-inkubators-detailed-outline-inkubators/25/external-left-chevron-arrows-inkubators-detailed-outline-inkubators-2.png" alt="external-left-chevron-arrows-inkubators-detailed-outline-inkubators-2"/>
                            </div>
                            <div className="artwork-gallery">
                                {departmentDetails && departmentDetails.map((detail, index) => (
                                    <div className="artwork-listing" key={index} id={`artwork-${index}`}>
                                        <h4>{detail.title}</h4>
                                        {detail.culture !== '' && detail.objectDate !== '' ? (
                                            <span>{detail.culture}, {detail.objectDate}</span>
                                        ) : detail.culture !== '' ? (
                                            <span>{detail.culture}</span>
                                        ) : detail.objectDate !== '' ? (
                                            <span>{detail.objectDate}</span>
                                        ) : null}
                                        
                                        <br></br>
                                        <a href={detail.objectURL} target="_blank" rel="noopener noreferrer">
                                            <em>View on Met Museum Website</em>
                                        </a>
                                        <img src={detail.primaryImageSmall} alt={detail.title} width='200' height='200' />
                                        <p>{detail.summary}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="right-arrow" key="right-arrow" ref={rightArrow}>
                                <img width="25" height="25" src="https://img.icons8.com/external-inkubators-detailed-outline-inkubators/25/external-right-chevron-arrows-inkubators-detailed-outline-inkubators-2.png" alt="external-right-chevron-arrows-inkubators-detailed-outline-inkubators-2"/>
                            </div>
                        </div>
                    )}
            </div>
        </div>
    );
};

export default Modal;