import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { XmlService } from './xml.service';


@Module({
  imports: [ScheduleModule.forRoot(), HttpModule],
  providers: [XmlService],
})
export class AppModule {}