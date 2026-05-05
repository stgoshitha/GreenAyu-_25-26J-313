from pydantic import BaseModel, model_validator
from typing import Optional

class NPKMessage(BaseModel):
    nitrogen: int
    phosphorus: int
    potassium: int
    moisture: int
    timestamp: int

class EnvironmentalMessage(BaseModel):
    interiorTemperature: Optional[float] = None
    interiorHumidity: Optional[float] = None
    exteriorTemperature: Optional[float] = None
    exteriorHumidity: Optional[float] = None
    isSufficientLight: Optional[bool] = None
    timestamp: int

    @model_validator(mode='after')
    def fallback_sensors(self) -> 'EnvironmentalMessage':
        if self.interiorTemperature is None:
            self.interiorTemperature = self.exteriorTemperature
        if self.interiorHumidity is None:
            self.interiorHumidity = self.exteriorHumidity
        return self