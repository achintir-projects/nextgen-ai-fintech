// Test file to check syntax
const test = () => {
  return (
    <div>
      {/* Main content */}
      <div>
        {/* Some content */}
      </div>
      
      {/* Modal 1 */}
      {condition1 && (
        <div>
          <div>
            {/* Modal content */}
          </div>
        </div>
      )}
      
      {/* Modal 2 */}
      {condition2 && (
        <div>
          <div>
            {/* Modal content */}
          </div>
        </div>
      )}
    </div>
  )
}