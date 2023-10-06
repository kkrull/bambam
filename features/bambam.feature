Feature: Convert EZDrummer 2 track to General MIDI
  As a musician
  I want to convert EZDrummer 2 tracks back and forth with General MIDI
  So that I can maintain flow when copying drum tracks to MuseScore

  Scenario: BamBam should produce a valid MIDI track
    #TODO KDK: Include Marker events?  It's not really about timing or notes; it's about structure and form.
    Given I have exported an EZDrummer 2 track from my DAW, as MIDI
    When I ask BamBam to remap that track to General MIDI Percussion
    Then the re-mapped track should be a valid MIDI track that others can read

  Scenario: BamBam should copy timing information from the original track
    Given I have exported an EZDrummer 2 track from my DAW, as MIDI
    When I ask BamBam to remap that track to General MIDI Percussion
    Then the re-mapped track should have the same resolution as the original
    And the re-mapped track should have the same tempo map as the original
    And the re-mapped track should have the same time signature as the original
    And the re-mapped track should play the same drum pattern as the original

  Scenario: BamBam should re-map an EZDrummer 2 track to General MIDI Percussion
    #TODO KDK: Include Key Signature?  It may not be very relevant on a percussion track
    Given I have exported an EZDrummer 2 track from my DAW, as MIDI
    When I ask BamBam to remap that track to General MIDI Percussion
    And non-standard notes should be changed to their equivalent in General MIDI
    And notes that are already General MIDI Percussion should stay the same
