const Department = ({data, handleDepartmentClick}) => {
    return (
        <div className="department-listing" id={data.departmentId} onClick={() => handleDepartmentClick(data.departmentId, data.displayName)}>
            <img src={data.primaryImage} alt={data.title} width='200' height='200' />
            <h2>{data.displayName}</h2>
        </div>
    )
}

export default Department;