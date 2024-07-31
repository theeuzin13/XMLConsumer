import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Cron } from '@nestjs/schedule';
import * as xml2js from 'xml2js';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class XmlService {
  constructor(private readonly httpService: HttpService) {}

  // Execute depending on the configured configuration, for example, in this case is exec for each minute
  @Cron('* * * * *')  
  async fetchAndParseXml() {
    try {
      console.log('Iniciando a requisição HTTP para buscar o XML');
      const response = await lastValueFrom(this.httpService.get('https://scsanctions.un.org/resources/xml/en/consolidated.xml?_gl=1*gs2q15*_ga*ODgwMjEyNDAuMTcyMjM2Nzc2MQ..*_ga_TK9BQL5X7Z*MTcyMjM2Nzc2MS4xLjAuMTcyMjM2Nzc2MS4wLjAuMA..'));
      console.log('Resposta recebida da requisição HTTP:', response.status, response.statusText);
      const data = response.data;

      const parser = new xml2js.Parser();
      parser.parseString(data, (err, result) => {
        if (err) {
          console.error('Erro ao parsear XML:', err);
        } else {
          this.processData(result.CONSOLIDATED_LIST);
        }
      });
    } catch (error) {
      console.error('Erro ao fazer a requisição HTTP:', error.message);
    }
  }

  processData(consolidatedList) {
    // Acess attributes CONSOLIDATED_LIST
    const { '$': attributes, INDIVIDUALS, ENTITIES } = consolidatedList;
    console.log('Atributos:', attributes);

    // Process INDIVIDUALS
    if (INDIVIDUALS && INDIVIDUALS[0] && INDIVIDUALS[0].INDIVIDUAL) {
      const individual = INDIVIDUALS[0].INDIVIDUAL;
      individual.forEach(individual => {
        // Acessing properties individuals
        const dataId = individual.DATAID ? individual.DATAID[0] : null;
        const firstName = individual.FIRST_NAME ? individual.FIRST_NAME[0] : null;
        const secondName = individual.SECOND_NAME ? individual.SECOND_NAME[0] : null;
        const thirdName = individual.THIRD_NAME ? individual.THIRD_NAME[0] : null;
        const fourthName = individual.FOURTH_NAME ? individual.FOURTH_NAME[0] : null;
        const fivethName = individual.FIVETH_NAME ? individual.FIVETH_NAME[0] : null;
        const unListType = individual.UN_LIST_TYPE ? individual.UN_LIST_TYPE[0] : null;
        
        console.log('Data ID:', dataId);
        console.log('First Name:', firstName);
        console.log('Second Name:', secondName);
        console.log('Third Name:', thirdName);
        console.log('Fourth Name:', fourthName);
        console.log('Fiveth Name:', fivethName);
        console.log('UnListType:', unListType);
      
        if (individual.INDIVIDUAL_ADDRESS) {
          individual.INDIVIDUAL_ADDRESS.forEach(address => {
            const street = address.STREET ? address.STREET[0] : null;
            const country = address.COUNTRY ? address.COUNTRY[0] : null;
            console.log('Street:', street);
            console.log('Country:', country);
          });
        }
      });

    }
  }
}
