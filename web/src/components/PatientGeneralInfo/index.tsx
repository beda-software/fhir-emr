export const PatientGeneralInfo = ({ generalInfo }: any) => (
    <div style={infoContainerStyle}>
        <div
            style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'space-around',
            }}
        >
            {generalInfo.map((el: any, index: any) => {
                return (
                    <div>
                        {generalInfo[index].map((el: any, index: any) => {
                            return (
                                <div key={index} style={{ marginBottom: 16 }}>
                                    <h3>{el.title}</h3>
                                    <div>{el.value}</div>
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    </div>
);

const infoContainerStyle = {
    width: 1080,
    backgroundColor: '#ffffff',
    padding: '32px 40px',
    boxShadow: '0px 6px 16px #E6EBF5',
};
