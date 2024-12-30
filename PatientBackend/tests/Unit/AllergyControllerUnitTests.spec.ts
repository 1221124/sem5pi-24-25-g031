import {beforeEach, describe, expect, it, vi} from 'vitest';
import {Description} from '../../src/domain/shared/Description';
import {ICD11Code} from "../../src/domain/shared/ICD11Code";
import {Name} from "../../src/domain/shared/Name";
import {Allergy} from "../../src/domain/allergy/Allergy";
import {Guard} from "../../src/core/logic/Guard";
import {AllergyId} from "../../src/domain/allergy/AllergyId";

describe('AllergyController', () => {
    const mockCodeResut = ICD11Code.create('1A00');
    const mockCode = mockCodeResut.getValue();
    const mockNameResult = Name.create('Pollen allergy');
    const mockName = mockNameResult.getValue();
    const mockDescriptionResult = Description.create('A pollen allergy');
    const mockDescription = mockDescriptionResult.getValue();

    let allergyProps;
    let allergy;

    beforeEach(() => {
        allergyProps = {
            code: mockCode,
            name: mockName,
            description: mockDescription,
        };

        const result = Allergy.create(allergyProps);
        allergy = result.getValue();
    });

    describe('createAllergy', () => {
        it('should successfully create an allergy', () => {
            vi.spyOn(Guard, 'againstNullOrUndefinedBulk').mockImplementationOnce(() => ({ succeeded: true, message: '' }));

            const result = Allergy.create(allergyProps);

            expect(result.getValue()).toBeInstanceOf(Allergy);
        });

        it('should fail to create a allergy with invalid props', () => {

            vi.spyOn(Guard, 'againstNullOrUndefinedBulk').mockImplementationOnce(() => ({ succeeded: false, message: 'Invalid parameters' }));

            const result = Allergy.create(allergyProps);

            expect(result.isSuccess).toBe(false);
        });

    });

    describe('getters and setters', () => {
        it('should return to correct allergyId', () => {
            const uniqueId = AllergyId.create();
            vi.spyOn(AllergyId, 'create').mockImplementationOnce(() => uniqueId);

            const props = {
                code: mockCodeResut.getValue(),
                name: mockNameResult.getValue(),
                description: mockDescriptionResult.getValue()
            };

            const allergy = Allergy.create(props, uniqueId.id).getValue();

            expect(allergy.id.toValue()).toBe(uniqueId.id.toValue());
        });

        it('should return the correct code', () => {
            expect(allergy.code).toEqual(mockCode);
        });

        it('should return the correct name', () => {
            expect(allergy.name).toEqual(mockName);
        });

        it('should return and modify the description', () => {
            expect(allergy.description).toEqual(mockDescription);

            allergy.description = Description.create('A new pollen allergy');

            expect(allergy.description).toEqual(Description.create('A new pollen allergy'));
        });

    });
})
