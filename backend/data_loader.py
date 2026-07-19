import os
import json
from fastapi import HTTPException

class DataLoader:
    def __init__(self, data_dir: str):
        self.data_dir = data_dir
        self.cache = {}
        
    def _load_json(self, filename: str) -> dict:
        if filename in self.cache:
            return self.cache[filename]
        filepath = os.path.join(self.data_dir, filename)
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                data = json.load(f)
                self.cache[filename] = data
                return data
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error loading {filename}: {str(e)}")

    def get_stadium(self) -> dict:
        return self._load_json('stadium.json')
        
    def get_crowd(self) -> dict:
        return self._load_json('crowd.json')
        
    def get_transport(self) -> dict:
        return self._load_json('transport.json')
        
    def get_volunteers(self) -> dict:
        return self._load_json('volunteers.json')
        
    def get_incidents(self) -> dict:
        return self._load_json('incidents.json')
        
    def get_match(self) -> dict:
        return self._load_json('match.json')

    def get_full_context(self) -> dict:
        return {
            'stadium': self.get_stadium(),
            'crowd': self.get_crowd(),
            'transport': self.get_transport(),
            'volunteers': self.get_volunteers(),
            'incidents': self.get_incidents(),
            'match': self.get_match()
        }

    def refresh_all(self):
        self.cache.clear()

base_dir = os.path.dirname(__file__)
data_dir = os.path.abspath(os.path.join(base_dir, '..', 'data'))
data_loader = DataLoader(data_dir=data_dir)
